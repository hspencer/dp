module Jekyll
    module FootnoteFilter
      def convert_footnotes(input)
        count = 0
        footnotes = []
  
        content = input.gsub(/\(\((.+?)\)\)/m) do
          count += 1
          footnotes << $1.strip
          "<sup id=\"fnref:#{count}\"><a href=\"#fn:#{count}\" class=\"footnote-ref\">#{count}</a></sup>"
        end
  
        if footnotes.any?
          content += "\n\n<div class=\"footnotes\">\n<hr/>\n<ol>\n"
          footnotes.each_with_index do |note, i|
            index = i + 1
            content += "<li id=\"fn:#{index}\">#{note} <a href=\"#fnref:#{index}\" class=\"footnote-back\">↩</a></li>\n"
          end
          content += "</ol>\n</div>\n"
        end
  
        content
      end
    end
  end
  
  Liquid::Template.register_filter(Jekyll::FootnoteFilter)